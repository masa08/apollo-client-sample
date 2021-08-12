import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

// clientの初期化
const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}

ReactDOM.render(
  <React.StrictMode>
    {/* reactでapollo clientを使用できるようにする */}
    <ApolloProvider client={client}>
      <ExchangeRates />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 状態管理に関して
// inMemoryCacheを用いれば、一定の条件を満たさない限り、cacheにデータを取りに行くのでそれで管理可能。
// reactive variablesなどを使うことによって、clientでも柔軟な状態管理が可能。
// readQuery, qriteQueryを使うとcacheと直接やり取りをすることもできる。

// apollo clientにおける状態管理が腑に落ちてなかったのだが、
// 結局readCacheもuseQuery(network-onlyでなくかつ2回目以降の発行)もcacheにデータを取りにいってて
// そういう意味ではやっていることは同じなのか、あとはreactive variablesでもっと柔軟に状態管理できると。
