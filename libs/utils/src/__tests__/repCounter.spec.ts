import { RepCounter } from '../src/repCounter';

describe('RepCounter', () => {
  let counter: RepCounter;

  beforeEach(() => {
    counter = new RepCounter();
  });

  it('should start in STANDING phase with 0 reps', () => {
    const state = counter.getState();
    expect(state.phase).toBe('STANDING');
    expect(state.repCount).toBe(0);
  });

  it('should transition through phases and count reps', () => {
    // Start standing
    counter.update(170);
    expect(counter.getState().phase).toBe('STANDING');

    // Force enough time to pass
    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 1000);

    // Descend
    counter.update(120);
    expect(counter.getState().phase).toBe('DESCENDING');

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 2000);

    // Hit bottom
    counter.update(80);
    expect(counter.getState().phase).toBe('BOTTOM');

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 3000);

    // Ascend
    counter.update(110);
    expect(counter.getState().phase).toBe('ASCENDING');

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 4000);

    // Back to standing - should count rep
    counter.update(165);
    expect(counter.getState().phase).toBe('STANDING');
    expect(counter.getState().repCount).toBe(1);

    jest.restoreAllMocks();
  });

  it('should reset correctly', () => {
    counter.reset();
    expect(counter.getState().repCount).toBe(0);
    expect(counter.getState().phase).toBe('STANDING');
  });
});

