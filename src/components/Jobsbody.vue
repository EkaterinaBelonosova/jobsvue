<template>
    <div class="container">
    <h3 class="text-center">The GitHub Jobs</h3>
    <section v-if="errored">
         <div class="alert alert-warning" role="alert">
            <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
            </div>
    </section>
    <section v-else>
        <div class="row">
            <div class="col-md col-lg-3">
                <div class="card border-light mb-3" style="max-width: 18rem;margin-top: 54px;">
                    <div class="card-body">
                       <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default">Description</span>
                            </div>
                            <input ref="descr" placeholder="description" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="inputGroup-sizing-default" style="width: 106px;">Location</span>
                            </div>
                            <input ref="local" placeholder="location" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                        </div>
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input"  id="fullTime">
                            <label class="custom-control-label" for="fullTime">Full Time</label>
                        </div>
                        <br>              
                        <div  class="row">
                            <div class="col">
                            <button @click="search()" type="button" class="btn btn-primary btn-top">Search</button> 
                            </div>
                            <div class="col ">
                            <button @click="cleanAll()" type="button" class="btn btn-outline-secondary btn-top">Clean</button> 
                            </div>                               
                        </div>
                    </div>
                </div>
                
            </div>
            <div v-if="loading" class="col-md col-lg-9">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border m-5 text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>              
            </div>
            <div v-else class="col-sm-9">
                <div v-if="emptyData" class="alert alert-danger" role="alert">
                    Nothing found(
                </div>
                <nav v-else aria-label="Page navigation example">
                    <ul class="pagination justify-content-end">
                        <li class="page-item" v-if="pageNumber > 1">
                        <a class="page-link" href="#" aria-label="Previous"  @click="prevPage()">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                        </li>
                        <li class="page-item"><a class="page-link" href="#">{{pageNumber}}</a></li>
                        <li class="page-item" v-if="getNextURLEmpty">
                        <a class="page-link" href="#" aria-label="Next" @click="nextPage()">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                        </li>
                    </ul>
                </nav>
                <div class="card-group"  style="height: 82vh;overflow: auto;">
                    <div class="col-sm-4" v-for="vacancy in results">
                    <div class="card border-primary mb-3" style="max-width: 18rem;">
                        <div class="card-header"><h5 class="card-title">{{vacancy.title}}</h5></div>
                        <div class="card-body">
                            <span style="display: inline-flex;"><img style="height: 18px;" src="../img/location_on.png"/><h6 class="card-title">{{vacancy.location}}</h6></span>
                            <p class="card-text font-italic">{{vacancy.type}}</p>
                            <p class="card-text">{{vacancy.company}}</p> 
                            <div  class="row">
                                <div class="col">
                                    <router-link :to="{path: '/about/'+vacancy.id }" type="button" class="btn btn-primary">Detailed</router-link> 
                                </div>
                                <div class="col text-right">
                                    <p class="card-text"><small class="text-muted align-bottom">{{vacancy.created_at | setDate}}</small></p> 
                                </div>                               
                            </div>
                        </div>
                         </div>
                    </div>
                </div>     
            </div>
        </div>
        
    </section>
 
</div>
</template>
<style>
@media (max-width: 1024px){
    .btn-top{   
        margin-top: 15px;
    }
}
</style>
<script>
function  urlad(page, desc) {
  return 'https://jobs.github.com/positions.json?page='+ page + desc;
}
import axios from 'axios'

    export default {
        name: 'Jobsbody',
        data() {
            return {
                nextResults: null,
                results: null,          
                loading: true,
                errored: false,
                pageNumber: 1,
                description: null,
                checked: null
            }

        },
        created () {
            // загружаем данные, когда представление создано
            // и данные реактивно отслеживаются
            this.nextData();
            this.fetchData();
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'nextData',
            '$route': 'fetchData'     
        },
        methods: {
            nextData: function () {  //get json data to next page
                axios
                .get(urlad(this.pageNumber+1, this.description)) // загружаем данные
                .then(response => (this.nextResults = response.data)); // получаем  ответ
                
            },
            fetchData: function () { //get json data to current  page
                axios
                .get(urlad(this.pageNumber, this.description)) // загружаем данные
                .then(response => (this.results = response.data)) // получаем  ответ
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => (this.loading = false));
            },
            updateData: function() {
                this.loading = true;
                this.fetchData();
                this.nextData(); 
            },
            nextPage: function() { 
                this.pageNumber++;
                this.updateData();
            },
            prevPage: function() { 
                this.pageNumber--;
                this.updateData();        
            },
            search: function(){
                let loc  = "", desc  = "", check  = "";
                if(this.$refs.local.value) loc = '&location='+ this.$refs.local.value;
                if(this.$refs.descr.value) desc = '&description='+ this.$refs.descr.value;  
                check = '&full_time='+ this.checked;       
                this.description = loc + desc + check;
                this.updateData();
            },
            cleanAll: function(){
                Object.assign(this.$data, this.$options.data.call(this)); // все значения data приводим к первоначальным
                this.updateData();
            }
        },
        filters: {  //получение даты вакансии в читабельном виде
            setDate (value) {
            return new Date(value).toLocaleDateString();
            },
        },
        computed: {
            getNextURLEmpty() {  //проверка на пустоту данных получаемых с json со следующей странице для пагинации
                if(this.nextResults){
                if(this.nextResults.length != 0) {
                    return true;
                }          
                }
                return false;
            },
            emptyData() {  //проверка на пустоту данных получаемых с json 
                if(this.results){
                if(this.results.length != 0) {
                    return false;
                }          
                }
                return true;
            }

        } 
    }
</script>

<style scoped>

</style>