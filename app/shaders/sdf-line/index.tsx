import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClockValue,
  useComputedValue,
  useTouchHandler,
  useValue,
  vec,
} from "@shopify/react-native-skia";

import React from "react";
import { Stack } from "expo-router";
import { useWindowDimensions } from "react-native";

const source = Skia.RuntimeEffect.Make(`
// What ever variables that are passed to uniforms can be initialized here
uniform float4 colors[4];
uniform float2 center;
uniform float2 pointer;
uniform float clock;

const float4 black = vec4(0, 0, 0, 1);

struct Paint {
  float4 color;
  bool stroke;
  float strokeWidth;
};

float2 translate(float2 pos, float2 offset) {
  return pos - offset;
}

float sdCircle(vec2 pos, float radius) {
  return length(pos) - radius;
}

float sdLine(vec2 pos, vec2 a, vec2 b) {
  vec2 pa = pos - a;
  vec2 ba = b - a;
  float h = saturate(dot(pa, ba) / dot(ba, ba));
  return length(pa - ba * h);
}

float4 draw(float4 color, float d, Paint paint) {
  bool isFill = !paint.stroke && d < 0;
  bool isStroke =  paint.stroke && abs(d) < paint.strokeWidth/2;
  if(isFill || isStroke) {
    return paint.color;
  }
  return color;
}

float4 drawCircle(float4 color, float2 pos, float radius, Paint paint) {
  float d = sdCircle(pos, radius);
  return draw(color, d, paint);
}

float4 drawLine(float4 color, float2 pos, float2 a, float2 b, Paint paint) {
  float d = sdLine(pos, a, b);
  return draw(color, d, paint);
}

vec4 main(vec2 xy) {
  float strokeWidth = 20;
  float radius = center.x - strokeWidth / 2;

  float4 color = colors[1];

  // float2 circlePos = translate(xy, center);
  // color = drawCircle(color, circlePos, radius, Paint(colors[2], false, 0));
  // float2 pointerCirclePos = translate(xy, pointer);
  // color = drawCircle(color, pointerCirclePos, 10, Paint(black, false, 0));
  // float2 strokeCirclePos = translate(pointer, center);
  // float strokeCircleRadius = sdCircle(strokeCirclePos, radius);
  // color = drawCircle(color, xy - pointer, abs(strokeCircleRadius), Paint(black, true, 3));

  // color = drawCircle(color, xy - center, 10, Paint(black, false, 0));
  // color = drawCircle(color, xy - pointer, 10, Paint(black, false, 0));
  // color = drawLine(color, xy, pointer, center, Paint(black, true, 3));

  float d = sdLine(xy, center, pointer);
  float offset = -clock * 0.1;
  float i = mod(floor((d + offset) / strokeWidth), 4);
  if (i == 0) {
    color = colors[0];
  } else if (i == 1) {
    color = colors[1];
  } else if (i == 2) {
    color = colors[2];
  } else if (i == 3) {
    color = colors[3];
  }
  return color;
}`)!;

const colors = ["#dafb61", "#61DAFB", "#fb61da", "#61fbcf"].map((c) =>
  Skia.Color(c)
);

const SDF = () => {
  const { width, height } = useWindowDimensions();
  const clock = useClockValue();
  const center = vec(width / 2, height / 2);
  const pointer = useValue(vec(0, 0));

  const handleTouch = useTouchHandler({
    onActive: (e) => {
      pointer.current = e;
    },
  });

  const uniforms = useComputedValue(
    () => ({ colors, center, pointer: pointer.current, clock: clock.current }),
    [pointer, clock]
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Canvas style={{ flex: 1 }} onTouch={handleTouch}>
        <Fill>
          <Shader source={source} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </>
  );
};

export default SDF;
