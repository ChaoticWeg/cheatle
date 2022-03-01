import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { Toaster } from "react-hot-toast";
import { BoardStateProvider } from "../hooks/useBoardState";
import "../styles/globals.css";

function MyApp(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <BoardStateProvider>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1"
                />
                <title>cheatle</title>
            </Head>
            <main>
                <Component {...pageProps} />
            </main>
            <Toaster />
        </BoardStateProvider>
    );
}

export default MyApp;
