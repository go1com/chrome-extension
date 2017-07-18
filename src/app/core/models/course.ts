

import {Lo} from "./lo";
import {Module} from "./module";

export class Course extends Lo {
  //Fields
  private modules: Array<Module>;

	constructor($id: number, $title: string, $description: string, $modules: Array<Module>) {
    super($id, $title, $description);
		this.modules = $modules;
	}

	public get $modules(): Array<Module> {
		return this.modules;
	}

	public set $modules(value: Array<Module>) {
		this.modules = value;
	}

  public static buildCourses(data: Array<any>): Array<Lo> {
    return data.map(d => {
      let modules = Module.buildModules(d.items);
      return new Course(d.id, d.title, d.description, modules);
    });
  }
}
