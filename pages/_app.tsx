import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { BoardStateProvider } from "../hooks/useBoardState";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <BoardStateProvider>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"
                />
                <title>Hello</title>
            </Head>
            <main>
                <Component {...pageProps} />
            </main>
        </BoardStateProvider>
    );
}

export default MyApp;
