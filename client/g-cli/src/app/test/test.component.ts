import { Component } from '@angular/core';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag'

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  user: {
    id: string;
    name: string;
  };
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

  loading: boolean =true;
  error :any;
  data: Todo[] | undefined;

  constructor(private apollo: Apollo){
    this.apollo.query<{gettodos:Todo[]}>({
      query: gql`
        query GetAllTodos {
          gettodos {
            id
            title
            completed
            user{
              id
              name
            }
          }
        }
      `
    })
    .subscribe(({data,loading})=>{
       this.loading = loading;
       this.data = data?.gettodos;                  
       this.error = null;
     },(error)=> {
      this.error = error;
    })
  }

}
