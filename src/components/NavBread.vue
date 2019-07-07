<template>
    <div id="NavBread">
        <div class="nav-breadcrumb-wrap">
            <div class="container">
                <nav class="nav-breadcrumb">
                    <a href="/">主页</a>
                    <slot></slot>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/css/nav-bread.css'
    export default {
        name: 'NavBread',
        components: {

        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        },
    }
</script>

<style scoped>

</style>