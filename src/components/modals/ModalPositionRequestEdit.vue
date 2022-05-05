<template>
  <div class="modal-position-notify-change">
    <ModalHeader :title="$translate('MODAL_POSITION_NOTIFY_CHANGE').replace('%s', payload.name)" @close="$emit('close')"/>
    <div class="body">
      <div
        class="description"
        v-html="$translate('MODAL_POSITION_NOTIFY_CHANGE_DESC').replace('%s', payload.name)"
      />
      <div class="fields">
        <div class="form-control">
          <label>{{ $translate('ENTRY_PRICE') }}</label>
          <input v-model="payload.entryPrice" :placeholder="payload.entryPrice">
        </div>
        <div class="form-control">
          <label>{{ $translate('LIQ_PRICE') }}</label>
          <input v-model="payload.liqPrice" :placeholder="payload.liqPrice">
        </div>
        <div class="form-control">
          <label>{{ $translate('SIZE') }}</label>
          <input v-model="payload.size" :placeholder="payload.size">
        </div>
        <div class="form-control">
          <label>{{ $translate('CONTRACT') }}</label>
          <input v-model="payload.contract" :placeholder="payload.contract">
        </div>
      </div>
    </div>
    <div class="buttons">
      <div class="flex-row">
        <button
          class="btn btn-default"
          @click="$emit('close')"
          v-html="$translate('CANCEL')"
        />
        <button
          class="btn btn-primary"
          @click="onClickSubmit"
          v-html="$translate('SUBMIT')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const payload = ref({})

    const onClickSubmit = async () => {
      try {
        ['entryPrice', 'liqPrice', 'size'].forEach(key => payload.value[key] = parseFloat(payload.value[key]))
        await plugins.$http.post('contents/real_time_positions/change_notifications', payload.value)
        emit('close')
        plugins.$toast.success('TOAST_POSITION_EDIT_REQUESTED')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    onMounted(() => {
      const p = props.options.position
      payload.value.id = p.id
      payload.value.name = p.name
      payload.value.entryPrice = p.entryPrice
      payload.value.liqPrice = p.liqPrice
      payload.value.size = p.size
      payload.value.contract = p.contract || 'BTCUSDT'
    })

    return {
      payload,
      onClickSubmit,
    }
  },
}
</script>

<style lang="scss" scoped>
.modal-position-notify-change {
  border-radius: 4px;
  width: 320px;

  .body {
    padding: 0 16px;
    line-height: 20px;
    color: var(--text-stress);
    display: flex;
    flex-direction: column;
    align-items: center;

    .form-control {
      width: 100%;
      margin-bottom: 0;

      label {
        font-size: 12px;
        margin-bottom: 8px;
      }
    }

    .description {
      margin: 16px 0;
      font-size: 12px;
    }

    .fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 16px;
    }
  }

  .buttons {
    margin: 16px auto;
    display: table;

    button {
      padding: 12px 40px;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>