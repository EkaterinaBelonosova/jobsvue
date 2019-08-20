function  urlad(page, desc) {
  return 'https://jobs.github.com/positions.json?page='+ page + desc;
}

Vue.component('preview', {
    template: '#view',
    props: 'name',
    data: function() {
        return {
          	name:name,
        	}
    },
});

  var app = new Vue({
    el: '#jobs',
    router: router,
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
        nextData: function () {
            axios
            .get(urlad(this.pageNumber+1, this.description)) // загружаем данные
            .then(response => (this.nextResults = response.data)); // получаем  ответ
            
        },
        fetchData: function () {
            axios
            .get(urlad(this.pageNumber, this.description)) // загружаем данные
            .then(response => (this.results = response.data)) // получаем  ответ
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
        },
        nextPage: function(){
          this.pageNumber++;
          this.fetchData();
          this.nextData(); 
         },
        prevPage: function(){
          this.pageNumber--;
          this.fetchData(); 
          this.nextData();         
        },
        search: function(){
          let loc  = "";
          let desc  = "";
          let check  = "";
          if(this.$refs.local.value) loc = '&location='+ this.$refs.local.value;
          if(this.$refs.descr.value) desc = '&description='+ this.$refs.descr.value;  
          check = '&full_time='+ this.checked;       
          this.description = loc + desc + check;
          this.fetchData();
          this.nextData();
        },
        cleanAll: function(){
          Object.assign(this.$data, this.$options.data.call(this));
          this.fetchData();
          this.nextData();
        },
        transferto: function() {
          this.$emit("transfer", this.$refs.vacancy.value);
        }
      },
    filters: {
        setDate (value) {
          return new Date(value).toLocaleDateString();
        },
    },
    computed: {
      getNextURLEmpty() {  //проверка на пустоту данных получаемых с json
        if(this.nextResults){
          if(this.nextResults.length != 0) {
            return true;
          }          
        }
        return false;
      },
      emptyData() {
        console.log(this.results);
        if(this.results){
          if(this.results.length != 0) {
            return false;
          }          
        }
        return true;
      }
    }
    
  });

var router = new VueRouter({
    routes: [
      { path: 'vacancy/:name', component: preview }
    ]
});
  
   