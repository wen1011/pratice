const app = Vue.createApp({
    // vue配置對象
    data() {
        return {
            // null=不顯示
            name: 'jenny',
            link: 'https://www.google.com/',
            todos: [
                { content: 'first thing', complete: false },
                { content: 'second thing', complete: true },
                { content: 'third thing', complete: false },
            ],
            books: ['harry potter', 'anna', 'you'],
            showAnswer: false,
            countDown: 5,
            timer: null,
        }
    },

    // / computed 最大特點是必須回傳一個值，並且會把它緩存起來，當函式裏的依賴改變時，才會重新執行和求值。
    computed: {
        // 每個屬性都是一個函數
        // 函數用this訪問data or 其他配置的值
        // 在模板中向data屬性一樣使用
        label() {
            {
                return this.showAnswer ? 'hide Answer' + this.countDown : 'show Answer'
            }
        },
    },
    // 重複的行為
    methods: {
        toggleAnswer() {
            this.showAnswer = !this.showAnswer
        },
    },
    watch: {
        showAnswer(newVal, oldVale) {
            if (newVal) {
                this.countDown = 5
                if (this.timer) {
                    clearInterval(this.timer)
                    this.timer = null
                }
                this.timer = setInterval(() => {
                    this.countDown -= 1
                    if (this.countDown === 0) {
                        this.showAnswer = false
                        clearInterval(this.timer)
                        this.timer = null
                    }
                }, 1000)
            }
        },
    },
})
app.mount('#app')
