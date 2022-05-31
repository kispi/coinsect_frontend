<template>
  <div class="modal-position-notify-change">
    <ModalHeader
      :title="$translate(allowed ? 'MODAL_POSITION_CHANGE' : 'MODAL_POSITION_NOTIFY_CHANGE').replace('%s', payload.name)"
      @close="$emit('close')"
    />
    <div class="body">
      <div
        class="description"
        v-html="$translate(allowed ? 'MODAL_POSITION_CHANGE_DESC' : 'MODAL_POSITION_NOTIFY_CHANGE_DESC').replace('%s', payload.name)"
      />
      <div class="fields">
        <div class="form-control">
          <label>{{ $translate('ENTRY_PRICE') }}</label>
          <input v-model="payload.entryPrice" placeholder="EX:) 40000">
        </div>
        <div class="form-control">
          <label>{{ $translate('LIQ_PRICE') }}</label>
          <input v-model="payload.liqPrice" placeholder="EX:) 30000">
        </div>
        <div class="form-control">
          <label>{{ $translate('SIZE') }} ({{ $translate('SIZE_DESC') }})</label>
          <input v-model="payload.size" placeholder="EX:) 5, -3...">
        </div>
        <div class="form-control">
          <label>{{ $translate('CONTRACT') }}</label>
          <input v-model="payload.contract" placeholder="EX:) BTCUSDT, ETHUSDT...">
        </div>
        <div
          @click="payload.onAir = !payload.onAir"
          class="form-control flex-row items-center no-select">
          <label class="m-0 cursor-pointer">{{ $translate('ON_AIR') }}</label>
          <AppToggler v-model="payload.onAir" class="flex-wrap no-touch"/>
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
          v-html="$translate(allowed ? 'CONFIRM' : 'SUBMIT')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  props: ['options'],
  setup(props, { emit }) {
    const plugins = getCurrentInstance().appContext.config.globalProperties

    const payload = ref({})

    const store = useStore()

    const allowed = computed(() => store.getters.config.allowDirectPositionEdit)

    const onClickSubmit = async () => {
      const o = JSON.parse(JSON.stringify(payload.value))
      try {
        ['entryPrice', 'liqPrice', 'size'].forEach(key => o[key] = parseFloat(o[key]))
        await plugins.$http.post('contents/real_time_positions/change_notifications', o)
        emit('close')
        plugins.$toast.success(allowed.value ? 'TOAST_POSITION_EDITED' : 'TOAST_POSITION_EDIT_REQUESTED')
        plugins.$bus.$emit('call-api')
      } catch (e) {
        plugins.$toast.error(e.data.message)
      }
    }

    const initPayload = () => {
      const p = props.options.position
      payload.value.id = p.id
      payload.value.name = p.name
      payload.value.entryPrice = p.entryPrice
      payload.value.liqPrice = p.liqPrice
      payload.value.size = p.size
      payload.value.contract = p.contract || 'BTCUSDT'
      payload.value.token = store.getters.chatUser.token
      payload.value.onAir = true
    }

    onMounted(initPayload)

    return {
      payload,
      allowed,
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
      padding: 8px 40px;

      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>