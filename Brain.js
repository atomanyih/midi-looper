class Brain {
  constructor(output) {
    this.output = output;

    this.state = {
      recording: false,
      recordingStartTimestamp: null,
      recordingStopTimestamp: null,
      loop: null,
      loops: [],
      loopInterval: null,
      loopTimeouts: []
    };

    this.actions = {
      startRecording: () => {
        this.state.recording = true;
        this.state.loop = {
          recordingStartTimestamp: Date.now(),
          events: []
        };
      },
      stopRecording: () => {
        this.state.recording = false;
        const {loop} = this.state;

        const events = loop.events.map(({t, msg}) => (
          {
            t: t - loop.recordingStartTimestamp,
            msg
          }
        ));

        this.state.loops = [
          {
            duration: Date.now() - loop.recordingStartTimestamp,
            events
          }
        ];

        this.actions.startLoop()
      },
      stopLoop: () => {
        const loops = this.state.loops.map((loop) => {
          clearInterval(loop.intervalId);

          loop.timeoutIds.forEach((timeoutId) => {
            clearTimeout(timeoutId);
          });

          return {
            ...loop,
            intervalId: null,
            timeoutIds: []
          }
        });

        this.state.loops = loops;
      },
      startLoop: () => {
        const replay = (msgEvents) =>
          msgEvents.map(
            ({t, msg: {_type, ...msgParams}}) => setTimeout(
              () => {
                this.output.send(_type, msgParams);
              },
              t
            )
          );

        const loops = this.state.loops.map((loop) => {
          const {events, duration} = loop;
          const timeoutIds = replay(events);

          const intervalId = setInterval(
            () => {
              this.state.loops = [
                {
                  ...this.state.loops[0],
                  timeoutIds: replay(events)
                }
              ];
            },
            duration
          );

          return {
            ...loop,
            timeoutIds,
            intervalId
          }
        });

        this.state.loops = loops;
      },
      recordMessage: (msg) => {
        if (!this.state.recording) {
          return
        }

        this.state.loop = {
          ...this.state.loop,
          events: [
            ...this.state.loop.events,
            {
              msg,
              t: Date.now()
            }
          ]
        }
      },
    };
  };
}


module.exports = Brain;