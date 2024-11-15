export class useAuth {
    id: number | undefined;
    isLogIn: boolean = false;
  
    constructor(initializer?: any) {
      if (!initializer) return;
      if (initializer.id) this.id = initializer.id;
      if (initializer.isActive) this.isLogIn = initializer.isLogIn;
    }
  }