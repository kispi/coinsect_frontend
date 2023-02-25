<template>
  <div class="view-games">
    <div class="list-games">
      <div
        @click="$modal.custom({
          component: 'ModalGame',
          options: {
            game,
            preventCloseOnClickBackdrop: true,
          },
        })"
        class="game"
        :key="game.title"
        v-for="game in games">
        <div class="overlay">
          <div class="title" v-html="$translate(game.title)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const games = [{
      title: 'GAME_LOTS',
      component: 'GameLots',
    }, {
      title: 'GAME_FLIP_COIN',
      component: 'GameFlipCoin',
    }, {
      title: 'GAME_COLOR_SENSE',
      component: 'GameColorSense',
    }]

    return {
      games,
    }
  },
}
</script>

<style lang="scss" scoped>
.view-games {
  .list-games {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;

    @media (max-width: 767px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .game {
    border-radius: 8px;
    background: var(--gs-44);
    padding-top: 100%;
    position: relative;
    cursor: pointer;

    &:hover {
      background: var(--background-light);
    }

    .overlay {
      color: var(--white);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 8px;

      .title {
        font-size: 20px;
        font-weight: 500;
      }
    }
  }
}
</style>