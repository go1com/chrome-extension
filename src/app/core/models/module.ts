
import { Lo } from "./lo";
import { Li } from "./li";

export class Module extends Lo {
  //Fields
  private lis: Array<Li>;
	constructor($id: number, $title: string, $description:string, $lis: Array<Li>) {
    super($id, $title, $description);
    this.lis = $lis;
	}

	public get $lis(): Array<Li> {
		return this.lis;
	}

	public set $lis(value: Array<Li>) {
		this.lis = value;
	}

  public static buildModules(data: Array<any>): Array<Module> {
    try {
      return data.map(d => {
        let lis: Array<Li> = Li.buildLis(d.items);
        return new Module(d.id, d.title, d.description, lis);
      });
    } catch(e) {
      console.log(e);
    }
    return [];
  }
}
