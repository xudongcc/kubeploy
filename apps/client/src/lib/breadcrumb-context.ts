export type BreadcrumbOptions = {
  id: string;
  title: string;
  link: any;
};

export class BreadcrumbContext {
  public readonly breadcrumbs: BreadcrumbOptions[] = [];

  constructor(breadcrumbs: Omit<BreadcrumbOptions, "id">[] = []) {
    this.breadcrumbs = breadcrumbs.map((breadcrumb) => ({
      id: crypto.randomUUID(),
      ...breadcrumb,
    }));
  }
}
