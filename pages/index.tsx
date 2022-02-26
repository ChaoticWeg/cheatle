import React from "react";
import { Row } from "../components/Row";
import { useBoardState } from "../hooks/useBoardState";

function Home() {
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);

    return (
        <div className="content">
            <h1 className="title">Hello</h1>
            <Row currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </div>
    );
}

export default Home;
