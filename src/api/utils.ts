export const keyById = <T extends { id: string }>(list: T[]) =>
  list.reduce((agg, curr) => {
    agg[curr.id] = curr;
    return agg;
  }, {} as Record<string, T>);
