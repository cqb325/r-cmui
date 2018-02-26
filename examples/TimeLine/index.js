import React from 'react';

import TimeLine from '../../src/components/TimeLine';


class Comp extends React.Component {
    displayName = 'Comp';

    onTick (clock) {
        // console.log(clock.currentTime);
    }

    componentDidMount () {
        // this.startRenderLoop();
    }

    startRenderLoop () {
        const scope = this;
        function render () {
            scope.clock.tick();
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    onTimeChange = (time) => {
        if (this.animation) {
            this.animation.updateTime(time);
        }
    }

    onMultiplierChange = (multipier, step) => {
        if (this.widget) {
            this.widget._clock.setStep(step);
            this.widget._clock.setMultiplier(multipier);
        }
    }

    render () {
        return (
            <div>
                <TimeLine ref={(f) => this.widget = f} />
                {/* <Animation ref={(f) => this.animation = f} onMultiplierChange={this.onMultiplierChange}/> */}
            </div>
        );
    }
}
export default Comp;
