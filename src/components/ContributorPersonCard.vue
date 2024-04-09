<template>
  <Transition appear>
    <div class="card">
      <div class="image-content">
        <!-- <span class="overlay"></span> Not doing the card overlay-->

        <div class="card-image">
          <img
            class="card-img"
            :src="imgPath(contributor.picture)"
            alt="../assets/stock_headshot.jpg"
          />
        </div>
      </div>

      <div class="card-content">
        <h2 class="name">{{ contributor.name }}</h2>
        <h2 class="location">{{ contributor.location }}</h2>
        <p class="bio">{{ contributor.bio }}</p>

        <div class="button-container">
          <a :href="linkedinPath(contributor.linkedin)">
            <button class="linkedin"><img src="../assets/linkedInIcon.jpg" /></button>
          </a>
          <a :href="gitPath(contributor.gitpage)">
            <button class="git"><img src="../assets/gitHubIcon.jpg" /></button>
          </a>
          <a href="contributor.resume">
            <button class="resume"><img src="../assets/resumeIcon.jpg" /></button>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
/*import { defineComponent } from '@vue/composition-api'*/
/*import imageFile from '../assets/funny_batman_profile.jpg'*/

export default {
  props: ['contributor'],
  //This methods turns allows you use relative path of img URL's
  methods: {
    imgPath() {
      return new URL(this.contributor.picture, import.meta.url).href
    },
    linkedinPath() {
      return new URL(this.contributor.linkedin, import.meta.url)
    },
    gitPath() {
      return new URL(this.contributor.gitpage, import.meta.url)
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'sans-serif';
}

.card {
  border-radius: 25px;
  background-color: #0a111c;

  width: 320px;
  height: 400px;
}

.image-content,
.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 14px;
}

.image-content {
  row-gap: 5px;
}

.card-image {
  position: relative;
  height: 150px;
  width: 150px;
  border-radius: 50%;
  /* background-color: rgb(255, 255, 255); */
  padding: 5px;
}

.card-image .card-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #53b290;
}

.name {
  color: #e55300;
  /* color:rgba(19, 18, 18, 0.918); */
  font-weight: bold;
  font-size: 25px;
  font-family: 'Michroma', sans-serif;
  display: flex;
  justify-content: center;
  align-content: center;
}

.location {
  color: #53b290;
  /* color: rgb(81, 81, 82); */
  font-size: 20px;
}
.bio {
  font-size: 15px;
  color: #53b290;
  /* color: rgb(81, 81, 82); */
  text-align: center;
  margin: 5px;
  height: 40px;
}

.button-container {
  display: flex;
  padding: 5px;
  margin: 5px;
}

button {
  border: solid;
  font-size: 15px;
  color: white;
  /*padding: 8px 16px;*/
  background-color: white;
  border-radius: 6px;
  margin: 5px;
}

button:hover {
  background: black;
}

.linkedin img {
  height: 50px;
  width: 50px;
}

.git img {
  height: 50px;
  width: 80px;
}

.resume img {
  height: 50px;
  width: 50px;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 2s ease,
    transform 1s ease-in-out;
  transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>
