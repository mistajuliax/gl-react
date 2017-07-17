module.exports=`//@flow
import React, { Component } from "react";
import { NearestCopy, LinearCopy, Uniform } from "gl-react";
import { Surface } from "gl-react-dom";
import { BlurXY } from "../blurxy";
import { images } from "./meta";
import timeLoop from "../../HOC/timeLoop";

const ContinuousBlur = timeLoop(
  class extends Component {
    render() {
      const { factor, children } = this.props;
      return (
        <BlurXY factor={factor}>
          {children}
        </BlurXY>
      );
    }
  },
  { refreshRate: 3 }
);

export default class Example extends Component {
  state = {
    buffering: false
  };
  componentWillReceiveProps({ image, refreshId }: *) {
    if (image !== this.props.image || refreshId !== this.props.refreshId) {
      this.setState({ buffering: false }); // start again with the image
    }
  }
  onDraw = () => {
    if (!this.state.buffering) {
      // after a first draw without buffering, enable it back
      this.setState({ buffering: true });
    }
  };
  getMainBuffer = () => {
    const { main } = this.refs;
    return main ? Uniform.backbufferFrom(main.getNodeRef()) : null;
  };
  render() {
    const { image, factor } = this.props;
    const { buffering } = this.state;
    return (
      <Surface width={400} height={300} preload={images}>
        <NearestCopy>
          <LinearCopy backbuffering ref="main" onDraw={this.onDraw}>
            <ContinuousBlur factor={factor}>
              {!buffering ? image : this.getMainBuffer}
            </ContinuousBlur>
          </LinearCopy>
        </NearestCopy>
      </Surface>
    );
  }
  static defaultProps = {
    image: require("./1.jpg"),
    factor: 0,
    refreshId: 0
  };
}
`
