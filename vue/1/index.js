const Playlist = {
    data() {
        return {
            playlist: ['1', '2', '3'],
            searchTerm: '',
        }
    },
    // computed 最大特點是必須回傳一個值，並且會把它緩存起來，當函式裏的依賴改變時，才會重新執行和求值。
    computed: {
        filteredPlaylist() {
            if (this.searchTerm) {
                return this.playlist.filter((song) => song.toLowerCase().includes(this.searchTerm.toLowerCase()))
            } else {
                return this.playlist
            }
        },
    },
}
Vue.createApp(Playlist).mount('#app')
