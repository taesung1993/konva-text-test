import "./App.css";
import "draft-js/dist/Draft.css";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import { useState } from "react";
import { useRef } from "react";

function App() {
  const [scale, setScale] = useState(1);
  const [texts, setTexts] = useState([]);
  const stageRef = useRef(null);
  const paragraphRef = useRef(null);

  const handleDownload = () => {
    /**
     * @type {import('Konva/lib/Stage').Stage}
     */
    const stageNode = stageRef.current;

    if (stageNode) {
      stageNode.scale(1, 1);
      const dataUrl = stageNode.toDataURL();
    }
  };

  const handleCreateText = () => {
    const wrapperNode = paragraphRef.current;
    const paragraphes = wrapperNode.children;
    let totalX = 0;
    let totalY = 0;
    const newTexts = [];

    for (let i = 0; i < paragraphes.length; i++) {
      const paragraph = paragraphes[i];
      const height = paragraph.offsetHeight;
      const spans = paragraph.children;

      for (let j = 0; j < spans.length; j++) {
        const span = spans[j];
        const style = window.getComputedStyle(span, null);
        const fontSize = style.getPropertyValue("font-size");
        const textAlign = style.getPropertyValue("text-align");
        const fontFamily = style.getPropertyValue("font-family");
        const color = style.getPropertyValue("color");
        const textContent = span.textContent;

        for (let k = 0; k < textContent.length; k++) {
          const char = textContent[k];
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          context.font = `${fontSize} ${fontFamily}`;
          context.textAlign = textAlign;
          context.fillStyle = color;
          context.textBaseline = "baseline";

          const metrics = context.measureText(char);
          const fontAscent = metrics.fontBoundingBoxAscent;
          const fontDescent = metrics.fontBoundingBoxDescent;
          const actualAscent = metrics.actualBoundingBoxAscent;
          const actualDescent = metrics.actualBoundingBoxDescent;
          const lineGap = height - fontAscent + fontDescent;

          const newText = {
            x: totalX,
            y: totalY + lineGap,
            text: char,
            fontSize: parseInt(fontSize),
            fill: color,
          };

          newTexts.push(newText);

          totalX += metrics.width;
        }
      }

      totalY += height;
      totalX = 0;
    }
    // const spans = paragraphNode.children;
    // const newTexts = [];
    // const height = paragraphNode.offsetHeight;

    // let totalX = 0;

    setTexts(() => newTexts);
  };

  return (
    <section>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <button onClick={() => setScale((prev) => prev + 0.05)}>
            Scale Up
          </button>
          <button onClick={() => setScale((prev) => prev - 0.05)}>
            Scale Down
          </button>
          <button onClick={handleDownload}>Download</button>
          <button onClick={handleCreateText}>Create Text</button>
        </div>

        <div>{Math.ceil(scale * 100)}%</div>
      </header>

      <main>
        <Stage
          width={673}
          height={846}
          scaleX={scale}
          scaleY={scale}
          ref={stageRef}
        >
          <Layer>
            {/* <Rect width={200} height={200} x={50} y={50} fill="#ee2554" /> */}
            <Group>
              {texts.map(({ x, y, text, fontSize, fill }, index) => (
                <Text
                  key={index}
                  text={text}
                  x={x}
                  y={y}
                  fontSize={fontSize}
                  fill={fill}
                />
              ))}
            </Group>
          </Layer>
        </Stage>
      </main>

      <aside
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
        ref={paragraphRef}
      >
        <p>
          <span
            style={{
              fontSize: "13px",
            }}
          >
            안녕하세요{" "}
          </span>
          <span
            style={{
              color: "#ee2554",
            }}
          >
            헬로우
          </span>
          <span
            style={{
              fontSize: "34px",
            }}
          >
            월드
          </span>
        </p>
        <p>
          <span
            style={{
              fontSize: "13px",
            }}
          >
            안녕하세요{" "}
          </span>
          <span
            style={{
              color: "#ee2554",
            }}
          >
            헬로우
          </span>
          <span
            style={{
              fontSize: "34px",
            }}
          >
            월드
          </span>
        </p>
      </aside>
    </section>
  );
}

export default App;
