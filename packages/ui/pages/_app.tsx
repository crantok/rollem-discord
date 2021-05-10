import Head from 'next/head'
import App, { AppContext } from 'next/app'
import { useEffect } from 'react';
import '../styles/globals.scss'
import '../styles/markdown.scss';
import { AppContext as MyAppContext, AppContextValue} from '../lib/contexts/request-context';
import { exorciseCircularReferences } from '../lib/helpers/exorcise-circular-references';
import { NextPageContext } from 'next';

function MyApp({ Component, passedContext, pageProps }): JSX.Element {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
  
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
        <meta name="msapplication-TileColor" content="#da532c"/>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <MyAppContext.Provider value={passedContext}>
        <Component {...pageProps} />
      </MyAppContext.Provider>
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { ctx, router } = appContext as AppContext;
  const { req, query, res, asPath, pathname } = ctx;
  const host = req.headers.host;
  const protocol = host.toLowerCase().startsWith('localhost') ? 'http' : 'https';
  const passedContext: AppContextValue = {
    req: exorciseCircularReferences(req),
    baseUrl: `${protocol}://${host}`,
    headers: req.headers,
    asPath,
    pathname,
    query,
  };

  return { passedContext, ...appProps }
}

export default MyApp
