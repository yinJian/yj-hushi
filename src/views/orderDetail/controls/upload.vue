<template>
  <div id="upload">
    <div class="list">
      <div class="title">this is upload</div>
      <pic-upload active="" ref="user"/>
    </div>
    <div @click="submit">提交审核</div>
  </div>
</template>

<script>
import { doDetail } from '@/data/orderDetail';
import PicUpload from '@/components/picUpload';
export default {
  name: 'upload',
  data() {
    return {
      data: doDetail,
      draw: false,
      moreText: '展开信息',
      active: 0
    };
  },
  components:{
    PicUpload
  },
  methods: {
    submit(){
      this.$refs.user.getData();
    }
  }
}
</script>

<style lang="less">
@import url("../../../assets/less/views/orderDetail/upload.less");
</style>
