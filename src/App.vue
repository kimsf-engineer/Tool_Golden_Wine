<template>
  <div id="app" class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar scroll</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarScroll"
        aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarScroll">
        <ul class="navbar-nav mr-auto my-2 my-lg-0 navbar-nav-scroll" style="max-height: 100px;">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">
              Link
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">Link</a>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control mr-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </nav>
    <div class="row">
      <div class="col-lg-2 bg-white shadow-sm side-bar border-right pl-1 pr-0 side-custom">
        <div class="list-group list-group-hover shadow-sm">
          <router-link v-for="(link, index) in router_links" :key="index"
            class="list-group-item list-group-item-action" :to="link.path">{{ link.name }}</router-link>
        </div>
      </div>
      <div class="col-lg-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      router_links: [
        { name: 'Thêm sản phẩm', path: '/' },
        { name: 'Danh sách sản phẩm', path: '/product_shopify' },
        { name: 'Danh sách nhà phân phối', path: '/shopify_vendor' }
      ]
    };
  },
  mounted() {
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 12px;
}

.side-custom {
  height: 100vh;
}
</style>