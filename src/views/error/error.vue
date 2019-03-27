<template>
  <div class="error">
    <img src="../../assets/images/develop.png" alt="">
    <div class="content">页面开发中...</div>
    <mu-button class="demo-color-btn" color="rgb(24,144,255)"> 返回 </mu-button>    
  </div>
</template>

<script>
export default {
  name: "error",
  data() {
    return {
    };
  },
};
</script>

<style lang="less" scoped>
@import url("../../assets/less/color.less");
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  img{
    width: 2rem;
  }
  .content{
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    font-size: 22px;
    font-weight: 600;
    color: @font-black;
  }
}
</style>
