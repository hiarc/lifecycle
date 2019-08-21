var lifecycle = new Vue({
    el: '#lifecycle',
    data: {
        loaded: {},
        selectYear: [],
        selectMonth: [],
        selectedYear: -1,  // dammy
        selectedMonth: -1, // dammy
        selectedDate: -1,  // dammy
    },
    created: function () {
        this.initDiary();
        this.changeDialy();
    },
    computed: {
        computeLifeCycleType: function(){
            let self = this;
            return function (date, hour){
                return self.loaded.days[date].lifecycle[hour-1];
            }
        },
    },
    methods: {
        // ------------------------------------------------------ カレンダー操作
        changeDialy: function(){
            let filename = this.selectedYear + this.zeroPadding(this.selectedMonth, 2);
            let path = 'http://localhost:3000/data/' + filename + '.json';
            let json = this.loadFile(path);
        },
        saveDialy: function(){
            let filename = this.selectedYear + this.zeroPadding(this.selectedMonth, 2);
            let path = 'http://localhost:3000/data/' + filename + '.json';
            let json = this.saveFile(path);
        },
        changeLifeCycleType: function(date, hour){
            switch(this.loaded.days[date].lifecycle[hour-1]){
                case 'none':
                    this.loaded.days[date].lifecycle[hour-1] = 'sleep_deep';
                    break;
                case 'sleep_deep':
                    this.loaded.days[date].lifecycle[hour-1] = 'sleep_light';
                    break;
                case 'sleep_light':
                    this.loaded.days[date].lifecycle[hour-1] = 'sleep_awake';
                    break;
                case 'sleep_awake':
                    this.loaded.days[date].lifecycle[hour-1] = 'goout';
                    break;
                case 'goout':
                    this.loaded.days[date].lifecycle[hour-1] = 'drag';
                    break;
                case 'drag':
                    this.loaded.days[date].lifecycle[hour-1] = 'none';
                    break;
                default :
                    console.log('err type');
                    break;
            }
        },
        deleteLifeCycleData: function(date, hour){
            this.loaded.days[date].lifecycle[hour-1] = 'none';
        },

        // ------------------------------------------------------ 処理系
        initDiary: function(){
            let date = new Date();
            let nowYear = date.getFullYear();
            let nowMonth = date.getMonth() + 1; //0月から
            let nowDate = date.getDate();

            // 年選択
            for(var i = 2019; i < 2050; i++){
                this.selectYear.push(i);
            }

            // 月選択
            for(var i = 1; i <= 12; i++){
                this.selectMonth.push(i);
            }

            this.selectedYear = nowYear;
            this.selectedMonth = nowMonth;
            this.selectedDate = nowDate;
        },
        
        loadFile: function(path){
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                switch (xhr.readyState) {
                    case 4: // complete
                        if(xhr.status >= 200 && xhr.status <= 304){ // success
                            lifecycle.loaded = JSON.parse(xhr.responseText);
                        }else{ // error
                            alert('読み込みに失敗しました。サーバーが起動しているか確認してください。');
                        }
                        break;
                    default:
                        break;
                }
            }
            xhr.open('GET', path);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send();
        },

        saveFile: function(path){
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                switch (xhr.readyState) {
                    case 4: // complete
                        if(xhr.status >= 200 && xhr.status <= 304){ // success
                            // 終了処理
                            alert('保存しました。');
                        }else{ // error
                            alert('保存に失敗しました。サーバーが起動しているか確認してください。');
                        }
                        break;
                    default:
                        break;
                }
            }
            xhr.open('POST', path);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.send(JSON.stringify(this.$data.loaded));
        },
        // ------------------------------------------------------ ユーティリティ
        zeroPadding : function(num,length){
            return ('0000000000' + num).slice(-length);
        }
        
    }
});