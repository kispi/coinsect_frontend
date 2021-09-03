import { ref, onMounted } from 'vue'
import crudService from '@/services/crud'
import helpers from '@/helpers'

const useTable = model => {
  const resp = ref({})

  const params = ref({})

  const callApi = async () => {
    resp.value = await crudService[model].all(params.value.build())
  }

  const onParams = o => {
    params.value = o
    callApi()
  }

  const onClickDelete = async (row, confirm, callback) => {
    const onConfirmDelete = async () => {
      try {
        await crudService[model].delete(row.id)
        callback && callback()
      } catch (e) {
        helpers.toast.error(e.data.message)
      } finally {
        callApi()
      }
    }

    if (confirm) {
      helpers.modal.confirm(`${model} (id: ${row.id})를 삭제할까요?`)
        .then(idx => {
          if (idx === 1) onConfirmDelete()
        })
      return
    }

    onConfirmDelete()
  }

  const create = async row => {
    try {
      await crudService[model].create(row || {})
    } catch (e) {
      helpers.toast.error(e.data.message)
    } finally {
      callApi()
    }
  }

  const update = async row => {
    try {
      await crudService[model].update(row)
    } catch (e) {
      helpers.toast.error(e.data.message)
    } finally {
      callApi()
      helpers.toast.success('UPDATED')
    }
  }

  onMounted(() => {
    params.value = helpers.qb().base()
    callApi()
  })

  return {
    resp,
    params,
    create,
    update,
    onClickDelete,
    callApi,
    onParams,
  }
}

export default useTable