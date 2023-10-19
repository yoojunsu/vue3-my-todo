import {createStore} from "vuex";

const store = createStore({
    state() {
        return {
            Todos: [],
            TodosOg: null,
            MyTodoTitle: "",
            MyTodoDetail: "",
            MyTodoDate: "",
            MyTodoComplete: false,
            ModalStatus: false,
            ModalModify: false,
            ChoiceTodoIdx: null,
            AddTodoErr: [false, false, false],
        }
    },
    
    mutations: {
        // 작성용 todo modal open 처리
        addTodoModalOpen(state) {
            state.ModalStatus = true;
            state.ModalModify = false;
        },

        //클릭시 todo detail 정보 볼 수있는 모달 출력.
        seeDetailTodoModalOpen(state,payload) {
            state.ModalStatus = true;
            state.ModalModify = true;
            state.ChoiceTodoIdx = payload;
        },

        // todo 작성,확인용 모달 닫기처리
        TodoModalClose(state) {
            state.ModalStatus = false;
        },


        //사용자가 작성한 new todo state 셋팅
        addTodoState(state, {title,date,detail}) {
            state.MyTodoTitle = title;
            state.MyTodoDate = date;
            state.MyTodoDetail = detail;
        },

        //새로운 todo add
        addTodo(state) {

            //add Todo state 유효성 검증
            const todoValChk = (stateInput, idx) => {
                if(!stateInput.trim()) {
                    state.AddTodoErr[idx] = true
                    setTimeout( () => {
                        state.AddTodoErr[idx] = false;
                    },3000);

                    return false;
                }

                return true;
            }

            if(!todoValChk(state.MyTodoTitle,0)) {
                return false;
            } else if(!state.MyTodoDate) {
                state.AddTodoErr[1] = true
                setTimeout( () => {
                    state.AddTodoErr[1] = false;
                },3000);
                return false;
            } else if(!todoValChk(state.MyTodoDetail,2)) {
                return false;
            }

            let myTodo = {
                "title": state.MyTodoTitle,
                "date": state.MyTodoDate,
                "detail": state.MyTodoDetail,
                "complete": false
            }

            if(state.Todos === null) {
                state.Todos = [];
                state.Todos.push(myTodo);
            } else {
                state.Todos.unshift(myTodo);
            }
            this.commit('setStorageData');
            state.MyTodoTitle = "";
            state.MyTodoDate = "";
            state.MyTodoDetail = "";
            state.ModalStatus = false;
        },

        //delete버튼을 클릭한 해당 todo 삭제처리
        deleteTodo(state,payload) {
            state.Todos.splice(payload, 1);
            this.commit('setStorageData');
        },

        // complete버튼을 클릭한 해당 todo 완료 처리.
        completeTodo(state,payload) {
            state.Todos[payload].complete = true;
            this.commit('setStorageData');
        },

        //todo list reset후 비어있는 Todos state local storage 저장
        resetTodo(state) {
            state.Todos.length = 0;
            state.Todos = [];

            this.commit('setStorageData');
        },

        //todo select
        todoFilter(state,payload) {
            let savedTodosData = JSON.parse(localStorage.getItem("myTodos"));
            const todosOG = [...savedTodosData];
            const filterTodos = todosOG.filter(item => item.complete === payload);
            state.Todos = filterTodos;
        },

        //todo og return
        todoOg(state) {
            let savedTodosData = JSON.parse(localStorage.getItem("myTodos"));
            const todosOG = [...savedTodosData];
            state.Todos = [...todosOG];
        },

        //local storage set mutations
        setStorageData(state) {
            localStorage.setItem("myTodos",JSON.stringify(state.Todos));
        },

        //local storage get mutations
        getStorageData(state) {
            let getState = JSON.parse(localStorage.getItem("myTodos"));
            state.Todos = getState;
        },


    }

});

export default store;