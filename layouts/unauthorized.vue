<template>
    <div>
        <!-- ---------------------------- ШАПКА ---------------------------- -->
        <b-navbar type="dark" variant="dark" tag="header">
            <b-navbar-brand to='/login'>Панель Администратора</b-navbar-brand>
        </b-navbar>
        <!-- ----------------------------- ТЕЛО ----------------------------- -->
        <main class="my-4 mx-2 position-relative" style="top: -6.5rem; padding-top: 6.5rem;">
            <b-container fluid>
                <nuxt />
            </b-container>
        </main>
    </div>
</template>

<style>
    html, body, #__nuxt, #__layout, 
    #__layout > div,  #__layout > div > main {
        height: 100%;
    }
</style>