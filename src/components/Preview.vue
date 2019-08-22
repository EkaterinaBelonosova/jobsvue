<template>
    <div v-if="loading" class="container">
            <div class="d-flex justify-content-center">
                  <div class="spinner-border m-5 text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                  </div>
            </div>              
    </div>
    <div v-else class="container">
       <router-link to="/" type="button" class="btn btn-outline-secondary">Back</router-link>
       <hr>
        <div class="card">
            <div class="card-header">
                <div class="container">
                  <div class="row">
                      <div class="col">
                        <h5 class="card-title">{{jobs.title}}</h5>
                          <p class="card-text"><small class="text-muted">{{jobs.location}}</small></p>
                          <p class="card-text"><small class="text-muted">{{jobs.type}}</small></p>
                      </div>
                      <div class="col text-right" >
                          <img :src='jobs.company_logo' style="max-height: 70px; max-width: 70px;" v-if='jobs.company_logo'/>
                          <h6 class="card-text" v-else>{{jobs.company}}</h6>
                          <br>
                          <a class="card-text" v-bind:href="jobs.company_url" target="_blank">{{jobs.company_url}}</a>
                      </div>
                </div>
               </div>
            </div>
            <div class="card-body">
                <p class="card-text" v-html='jobs.description'></p>
            </div>
            <div class="card-footer text-muted alert alert-success" style="margin-bottom: 0px;">
              <div class="container">
                  <div class="row">
                      <div class="col">
                         <p class="card-text">To respond:</p><a target="_blank" class="card-text" v-html='jobs.how_to_apply'></a>
                      </div>
                      <div class="col text-right" >
                          <p class="card-text text-right"><small class="text-muted">{{jobs.created_at | setDate}}</small></p> 
                      </div>
                  </div>            
              </div>
            </div>
        </div>
        <hr>
        <div class="alert alert-dark row justify-content-md-center" role="alert">
         <p>Vacancy taken from:</p><a v-bind:href="jobs.url" target="_blank">{{jobs.url}}</a>
        </div>
    </div>
    
</template>

<script>
import axios from 'axios'
    export default {
      name: 'Preview',
      data () {
        return {
          jobs: null,
          loading: true
        }
      },
      created () {
            // загружаем данные, когда представление создано
            // и данные реактивно отслеживаются
            this.getdata();
      },
      watch: {
          // при изменениях маршрута запрашиваем данные снова
          '$route': 'getdata', 
      },
      methods: {
        getdata: function () {
                axios
                .get('https://jobs.github.com/positions/'+this.$route.params.id+'.json') // загружаем данные
                .then( res => (this.jobs = res.data))
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            }
      },
      filters: { //перевод даты 
            setDate (value) {
            return new Date(value).toLocaleDateString();
            },
        },
    }
    </script>
