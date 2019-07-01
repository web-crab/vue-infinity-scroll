const delay = (ms) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}

const title = 'Страдания юного Вертера'
const body = 'Душа моя озарена неземной радостью, как эти чудесные весенние утра, которыми я наслаждаюсь от всего сердца. Я совсем один и блаженствую в здешнем краю, словно созданном для таких, как я. Я так счастлив, мой друг, так упоен ощущением покоя, что искусство мое страдает от этого.'
const getImgSrc = (n) => require(`@/assets/${n}.jpg`)
let id = 1

export default {
  async get (count) {
    await delay(count * 75)
    return Array(count).fill().map(() => ({
      title,
      body,
      imgSrc: getImgSrc((id % 10) || 10),
      id: id++
    }))
  }
}
