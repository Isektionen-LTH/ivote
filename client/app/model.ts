export class Option {
  public selected: boolean = false;
  constructor(public name: string) {}
}

export class Vote {
  title: string;
  options: Option[];
  selected: string;
}
