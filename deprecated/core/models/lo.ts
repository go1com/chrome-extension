import { Module } from "./module";

export class Lo {
  //Fields
  private id: number;
  private title: string;
  private description: string;


	constructor($id: number, $title: string, $description: string) {
    this.id = $id;
		this.title = $title;
    this.description = $description;
	}

	public get $id(): number {
		return this.id;
	}

	public set $id(value: number) {
		this.id = value;
	}

	public get $title(): string {
		return this.title;
	}

	public set $title(value: string) {
		this.title = value;
	}


	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}

}
