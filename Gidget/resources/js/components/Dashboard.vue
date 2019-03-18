<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex md12 class="text-md-center" mt-5>
                <h1>Welcome to Gidget</h1>
            </v-flex>
            <v-flex md12 sm6 offset-sm3 mt-3>
                <blockquote class="blockquote text-md-center">
                    This is a SPA mock of Gidget <br>
                    with basic Laravel Authentication
                </blockquote>
            </v-flex>
            <v-flex xs12 sm6 md3 offset-sm3 class="text-md-center" mt5>
                <v-btn color="primary" to="/signup">Sign-Up</v-btn>
                <v-btn to="/signin">Sign In</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {}
</script>