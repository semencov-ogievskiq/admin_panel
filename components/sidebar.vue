<template>
    <div v-if="active" class="sidebar active" v-clickOutside="clickOut">
        <b-nav vertical>
            <slot/>
        </b-nav>
    </div>
    <div v-else class="sidebar">
        <b-nav vertical>
            <slot/>
        </b-nav>
    </div>
</template>

<script>
    import vClickOutside from 'v-click-outside'
    

    export default {
        directives: {
            clickOutside: vClickOutside.directive
        },
        props: { 
            active: Boolean,
            toggle: Function
        },
        methods: {
            clickOut(e){
                if(this.active){
                    this.toggle()
                }
            }
        }
    }
</script>

<style>
    /* ---------- sidebar ----------*/
    .sidebar {
        background-color: #343a40 !important;
        position: fixed;
        top: 3.4rem;
        width: 3rem;
        z-index: 1;
        height: calc(100% - 3.4rem);
        padding-bottom: 2rem;
        transition: width .2s ease-in;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .sidebar:hover, .sidebar[class~="active"] {
        width: 15rem;
    }

    @media (min-width: 768px) {
        .sidebar[class~="active"] + main {
            margin-left: 16rem;
        }
    }
    /* ---------- nav-link ----------*/
    .sidebar > .nav > .nav-item > .nav-link {
        padding: 0.5rem 0.9rem;
        color: #fff;
        text-decoration: none;
    }

    .sidebar > .nav > .nav-item > .nav-link:hover,
    .sidebar > .nav > .nav-item > .nav-link[class~="nuxt-link-active"] {
        color: #007bff!important;
    }

    .sidebar > .nav > .nav-item > .nav-link > span {
        position: absolute;
        left: 3rem;
    }
    .sidebar > .nav > .nav-item > .nav-link > svg {
        display: inline-block;
    }

    .sidebar > .nav > .nav-item > .nav-link > span,
    .sidebar > .nav > .nav-item > .nav-link > div {
        display: none;
    }

    .sidebar > .nav > .nav-item > .nav-link > div {
        margin: 1rem 0;
    }

    .sidebar:hover > .nav > .nav-item > .nav-link > span,
    .sidebar[class~="active"] > .nav > .nav-item > .nav-link > span {
        display: inline-block;
    }

    .sidebar:hover > .nav > .nav-item:hover > .nav-link > div,
    .sidebar:hover > .nav > .nav-item > .nav-link[class~="nuxt-link-active"] > div,
    .sidebar[class~="active"] > .nav > .nav-item:hover > .nav-link > div,
    .sidebar[class~="active"] > .nav > .nav-item > .nav-link[class~="nuxt-link-active"] > div {
        display: block;
    }

    .sidebar > .nav > .nav-item:hover > .nav-link{
        color: #007bff!important;
    }
    
    /* ---------- nav-link + div ----------*/
    .sidebar > .nav > .nav-item > .nav-link > div > a {
        display: block;
        margin-left: 3rem;
        margin-bottom: 0.5rem;
        color: #fff;
        text-decoration: none;
    }
    .sidebar > .nav > .nav-item > .nav-link > div > a:hover,
    .sidebar > .nav > .nav-item > .nav-link > div > a[class~="nuxt-link-active"] {
        color: #007bff!important;
    }

</style>