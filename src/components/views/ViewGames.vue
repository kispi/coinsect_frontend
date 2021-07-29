<template>
  <div class="view-games">
    <div class="list-games">
      <div
        @click="$modal.custom({
          component: 'ModalGame',
          options: { game },
        })"
        class="game"
        :key="game.title"
        v-for="game in games">
        <div class="overlay">
          <div class="title" v-html="$translate(game.title)"/>
          <div class="description" v-html="$translate(game.description)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const games = [{
      title: 'GAME_PICK_COIN',
      description: 'GAME_PICK_COIN_DESC',
      component: 'GamePickCoin',
    }]

    return {
      games,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-games {
  padding: var(--app-default-page-padding);

  .list-games {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 8px;

    @media (max-width: 767px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .game {
    border-radius: 8px;
    background: var(--brand-primary);
    padding-top: 100%;
    position: relative;
    cursor: pointer;

    &:hover {
      background: var(--brand-primary-hover);
    }

    .overlay {
      color: var(--white);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 16px;

      .title {
        font-size: 20px;
        font-weight: 500;
      }

      .description {
        margin-top: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>