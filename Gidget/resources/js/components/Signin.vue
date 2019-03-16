<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Sign In</h1>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
                <form>
                    <v-layout column>
                        <v-flex>
                            <v-text-field
                                    name="email"
                                    label="Email"
                                    id="email"
                                    type="email"
                                    required></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                                    name="password"
                                    label="Password"
                                    id="password"
                                    type="password"
                                    required></v-text-field>
                        </v-flex>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn color="primary" type="submit">Sign In</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                submitted: false,
                loading: false,
                returnUrl: '',
                error: ''
            }
        },
        created () {
            //reset login status
            userService.logout();

            // get return url from route params or default to '/
            this.returnUrl = this.$route.query.returnUrl || '/';
        },
        methods: {
            handleSubmit (e) {
                this.submitted = true;
                const { email, password} = this;

                //stop if form is invalid
                if (!(email && password)) {
                    return;
                }

                this.loading = true;
                userService.login(email, password)
                    .then(
                        user => router.push(this.returnUrl),
                        error => {
                            this.error = error;
                            this.loading = false;
                        }
                    );
            }
        }
    };
</script>