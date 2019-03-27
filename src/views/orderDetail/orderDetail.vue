<template>
  <div id="orderDetail">
    <detail-list/>
    <detail-flow/>
  </div>
</template>

<script>
import DetailList from './controls/detailList'
import DetailFlow from './controls/detailFlow'
export default {
  name: 'orderDetail',
  data() {
    return {
      datas:[],
      active: 0
    };
  },
  components: {
    DetailList,
    DetailFlow
  }
}
</script>

<style lang="less">
@import url("../../assets/less/color.less");
#orderDetail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
}
</style>
