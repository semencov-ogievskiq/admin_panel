<template>
    <li class="nav-item">
        <b-link class="nav-link" :to="to" :event="(!slotList)?'click':''" :style="(slotList)?'cursor: default;':''">
            <slot/>
            <span>{{text}}</span>
            
            <div v-if="slotList">
                <slot name="list" />
            </div>
        </b-link>
    </li>
</template>

<script>
    export default {
        props: { 
            to: { type: String },
            text: { type: String, required: true },
            disable: Boolean
        },
        computed: {
            slotList() {
                return (this.$slots.list && this.$slots.list.length > 0)? true : false
            }
        }
    }
</script>