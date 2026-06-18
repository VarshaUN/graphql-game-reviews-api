let games = [
    { id: "1", title: "The Last of Us", platform: ["PS4", "PS5"] },
    { id: "2", title: "God of War", platform: ["PS4"] },
    { id: "3", title: "Halo Infinite", platform: ["Xbox One", "Xbox Series X"] },
    { id: "4", title: "The Legend of Zelda: Breath of the Wild", platform: ["Nintendo Switch"] },
    { id: "5", title: "Cyberpunk 2077", platform: ["PC", "PS4", "PS5", "Xbox One", "Xbox Series X"] }
]

let authors = [
    { id: "1", name: "John Doe", verified: true },
    { id: "2", name: "Jane Smith", verified: false },
    { id: "3", name: "Alice Johnson", verified: true },
    { id: "4", name: "Bob Brown", verified: false },
    { id: "5", name: "Charlie Davis", verified: true }
]

let reviews = [
    { id: "1", rating: 5, content: "Amazing game!", authorId: "1", gameId: "1" },
    { id: "2", rating: 4, content: "Great gameplay but some bugs.", authorId: "2", gameId: "2" },
    { id: "3", rating: 3, content: "Good but not great.", authorId: "3", gameId: "3" },
    { id: "4", rating: 5, content: "A masterpiece!", authorId: "4", gameId: "4" },
    { id: "5", rating: 2, content: "Disappointing experience.", authorId: "5", gameId: "5" }
]

export default { games, authors, reviews }