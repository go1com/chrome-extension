import { Go1BookmarkPage } from './app.po';

describe('go1-bookmark App', () => {
  let page: Go1BookmarkPage;

  beforeEach(() => {
    page = new Go1BookmarkPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
