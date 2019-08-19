
  function  urlad(page) {
    return 'https://jobs.github.com/positions.json?page='+page;
  }
  var app = new Vue({
    el: '#res',
    data() {
        return {
            nextResults: null,
            results: null,          
            loading: true,
            errored: false,
            pageNumber: 1
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
      
   /* mounted(){
        axios
        .get(urlad) // загружаем данные
        .then(response => (this.info = response.data)) // получаем  ответ
        .catch(error => {
            console.log(error);
            this.errored = true;
        })
        .finally(() => (this.loading = false));

    },*/
    methods: {
        nextData: function () {
            axios
            .get(urlad(this.pageNumber+1)) // загружаем данные
            .then(response => (this.nextResults = response.data)); // получаем  ответ
            
        },
        fetchData: function () {
            axios
            .get(urlad(this.pageNumber)) // загружаем данные
            .then(response => (this.results = response.data)) // получаем  ответ
            .catch(error => {
                console.log(error);
                this.errored = true;
            })
            .finally(() => (this.loading = false));
        },
        nextPage: function(){
            this.pageNumber++;
            this.loading = true;
            this.fetchData();
            this.nextData();
  
         },
         prevPage: function(){
          this.pageNumber--;
          this.loading = true;
          this.fetchData(); 
          this.nextData();         
         },

      },
    filters: {
        setDate (value) {
          return new Date(value).toLocaleDateString();
        }
    },
    computed: {
      getNextURLEmpty() {  //проверка на пустоту данных получаемых с json
        if(this.nextResults){
          if(this.nextResults.length != 0) {
            return true;
          }          
        }
        return false;
      }
    }
    
  });


   