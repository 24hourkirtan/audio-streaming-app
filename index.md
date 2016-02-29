<div class="page-header">
  <h1  id="page-title">Getting Started</h1>
</div>

The APIs run on a **[Node.js](https://www.nodejs.org)** instance using the **[Restify](http://restify.com/)** framework.

Example Angular 2 (typescript)
```
// Example using Angular 2 and typescript
this.header.set('Authorization', this.profile.auth);
this.header.set('Content-Type', 'application/json'); // Used by POSTS
return new Promise(resolve => {
    this.http.get('http://api.24hourkirtan.com/user/playlists', {headers:this.header})
    .subscribe(res => {
        var data = res.json();
        resolve(res.json());
    }, error => {
        resolve(error);
    });
});
if (1 < 2){}
```

### List User's Playlists

List repositories that are accessible to the authenticated user.

This includes repositories owned by the authenticated user, repositories where the
authenticated user is a collaborator, and repositories that the authenticated user
has access to through an organization membership.

```javascript
GET /user/playlists

```
-------------------
#### Parameters
** None
