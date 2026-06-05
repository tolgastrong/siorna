export interface TrelloCard {
  title: string
  url: string
  board: string
  status: string
  updatedAt: string
  source: 'trello'
}

export async function fetchTrelloActivity(
  memberId: string,
  apiKey: string,
  apiToken: string,
  since: Date,
  until: Date
): Promise<TrelloCard[]> {
  const auth = `key=${apiKey}&token=${apiToken}`

  try {
    // Üyenin board'larını çek
    const boardsRes = await fetch(
      `https://api.trello.com/1/members/${memberId}/boards?${auth}&fields=id,name`
    )
    if (!boardsRes.ok) throw new Error(`Trello boards API ${boardsRes.status}`)
    const boards: { id: string; name: string }[] = await boardsRes.json()

    const allCards: TrelloCard[] = []

    for (const board of boards) {
      const cardsRes = await fetch(
        `https://api.trello.com/1/boards/${board.id}/cards?${auth}&members=true&fields=name,url,dateLastActivity,idList,idMembers`
      )
      if (!cardsRes.ok) continue
      const cards: any[] = await cardsRes.json()

      // Tarih ve üye filtresi
      const filtered = cards.filter((card) => {
        const activityDate = new Date(card.dateLastActivity)
        return (
          activityDate >= since &&
          activityDate <= until &&
          card.idMembers?.includes(memberId)
        )
      })

      if (filtered.length === 0) continue

      // Tüm list ID'lerini toplu çek (her card için ayrı istek yerine)
      const listIds = [...new Set(filtered.map((c) => c.idList))]
      const listMap: Record<string, string> = {}

      await Promise.all(
        listIds.map(async (listId) => {
          try {
            const listRes = await fetch(
              `https://api.trello.com/1/lists/${listId}?${auth}&fields=name`
            )
            if (listRes.ok) {
              const list = await listRes.json()
              listMap[listId] = list.name
            }
          } catch {
            listMap[listId] = 'Unknown'
          }
        })
      )

      for (const card of filtered) {
        allCards.push({
          title: card.name,
          url: card.url,
          board: board.name,
          status: listMap[card.idList] ?? 'Unknown',
          updatedAt: card.dateLastActivity,
          source: 'trello',
        })
      }
    }

    return allCards
  } catch (err) {
    console.error(`[trello] ${memberId} için veri çekilemedi:`, err)
    return []
  }
}