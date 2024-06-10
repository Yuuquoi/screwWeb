<script>
import { RouterLink, RouterView } from 'vue-router'

export default {

    mounted() {
        this.changeIconColor();
        this.checkLogin();
    },

    data(){
        return {
            htmlNow: "",
            isLogin: "",
        }
    },
    
    methods: {
        // 設定 icon 顏色
        changeIconColor(){
            this.htmlNow = this.$router.options.history.location;
        },

        // 判斷是否登入
        checkLogin(){
            this.isLogin = sessionStorage.getItem("account");
        },

        // 登出
        logout(){
            // fetch("http://localhost:8080/member/logout",{
            //     method: 'GET',
            //     headers:{
            //         "Content-Type":"application/json"
            //     },
            // })
            // .then(res => res.json())
            // .then((data) => {
            //     if(data.code != 200){
            //         console.log(data);
            //         this.alarmEvent(data.message);
            //         return;
            //     }
            //     this.successEvent("已登出");
            //     sessionStorage.removeItem("account");
            //     window.location.reload();
            // });

            sessionStorage.removeItem('account');
            location.reload();
        },

        // 跳轉頁面
        changeRouter(link){
            this.htmlNow = link;
            this.$router.push(link);
        }
    },

    components:{
        RouterLink,
        RouterView,
    },
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <div class = "header">

        <div class="logo">
            Logo
        </div>

        <div class="home item" :class="{now:this.htmlNow === '/'}">
            <i class="fa-solid fa-house" @click="changeRouter('/')"></i>
        </div>

        <div class="statusMachine item" :class="{now:this.htmlNow === '/status/machine'}">
            <i class="fa-solid fa-database" @click="changeRouter('/status/machine')"></i>
        </div>

        <div class="statusOrder item" :class="{now:this.htmlNow === '/status/order'}">
            <i class="fa-solid fa-clipboard-list" @click="changeRouter('/status/order')"></i>
        </div>

        <!-- <div class="login item" :class="{now:this.htmlNow === '/login'}"  v-show="!this.isLogin">
            <i class="fa-solid fa-user" @click="changeRouter('/login')"></i>
        </div> -->

        <div class="memberMachine member item" :class="{now:this.htmlNow === '/member/machine' || this.htmlNow === '/login'}" v-show="this.isLogin">
            <i class="fa-solid fa-database" @click="changeRouter('/member/machine')"></i>
            <i class="fa-solid fa-gear" @click="changeRouter('/member/machine')"></i>
        </div>

        <div class="memberOrder member item" :class="{now:this.htmlNow === '/member/order'}" v-show="this.isLogin">
            <i class="fa-solid fa-clipboard-list" @click="changeRouter('/member/order')"></i>
            <i class="fa-solid fa-gear" @click="changeRouter('/member/order')"></i>
        </div>

        <div class="logout"  v-show="this.isLogin" @click="logout">
            登出
        </div>

    </div>
</template>

<style lang="scss" scoped>

    // 基本樣式
    .header{

        width: 100%;
        height: 100vh;
        border-right: 1px solid #D4D4D1;
        padding-top: 0.5vw;

        display: flex;
        align-items: center;
        flex-direction: column;

        .logo{

            width: 3vw;
            height: 3vw;
            border-radius: 50%;
            margin-top: 1.25vw;
            margin-bottom: 1.25vw;
            background-color: #5E5E5E;

            font-size: 1vw;
            color: white;

            text-align: center;
            line-height: 3vw;

        }

        .item{

            margin-top: 1vw;
            margin-bottom: 1vw;

            cursor: pointer;

            i{
                font-size: 1.8vw;
                color: #5E5E5E;
            }

            &:hover{
                i{
                    color: #3d3d3d;
                }
            }

        }

        .member{
            position: relative;

            .fa-gear{

                font-size: 1vw;
                position: absolute;
                right: -0.5vw;
                bottom: -0.5vw;
                background-color: white;

            }

        }

        .logout{
            position: fixed;
            bottom: 1.5vw;
            font-size: 1.2vw;
            cursor: pointer;
        }

    }

    // 添加備註
    .header{

        .item{
            position: relative;

            &:hover{

                &::after{
                height: 70%;
                padding: 0.2vw;
                padding-left: 0.4vw;
                padding-right: 0.4vw;
                background-color: rgba(45, 45, 45, 0.44);

                position: absolute;
                top:0vw;

                font-size: 0.8vw;
                color: white;
                line-height: calc(70% + 0.8vw);
                }

            }

        }

        .home{
            &:hover{
                &::after{
                    content: var(--home);
                    left: 2.5vw;
                    width: 1.6vw;
                }
            }
        }

        .statusMachine{
            &:hover{
                &::after{
                    content: var(--statusMachine);
                    left: 2.2vw;
                    width: 3.2vw;
                }
            }
        }

        .statusOrder{
            &:hover{
                &::after{
                    content: var(--statusOrder);
                    left: 2vw;
                    width: 3.2vw;
                }
            }
        }

        .login{
            &:hover{
                &::after{
                    content: var(--login);
                    left: 2vw;
                    width: 1.6vw;
                }
            }
        }

        .memberMachine{
            &:hover{
                &::after{
                    content: var(--memberMachine);
                    left: 2.5vw;
                    width: 3.2vw;
                }
            }
        }

        .memberOrder{
            &:hover{
                &::after{
                    content: var(--memberOrder);
                    left: 2.5vw;
                    width: 3.2vw;

                }
            }
        }
    }

    // 特殊樣式
    .header{

        .now{

            i{
                color: var(--blue);
            }

            &:hover{
                i{
                    color: var(--blue);
                }
            }   
        }

    }

</style>