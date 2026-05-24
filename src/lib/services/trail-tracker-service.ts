import axios from "axios";
import type { Session, User, Candidate, Category, Trail } from "$lib/types/trail-tracker-types";
import { currentCategories, currentTrails, loggedInUser } from "$lib/runes.svelte";
import { goto } from "$app/navigation";


export const trailTrackerService = {
  baseUrl: "http://localhost:3000",
  // pass user object omitting user id
  async signup(user: Omit<User, '_id'>): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      if (response.status == 201) {
        // redirect to the login view after a short delay to allow the user to see the message  
        setTimeout(() => {
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          goto("/login");
        }, 500);
        return true;
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      if (response.data.success) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
        const session: Session = {
          name: response.data.name,
          token: response.data.token,
          userid: response.data.userid
        };
        // console.log(session);
        this.saveSession(session, email);
        await this.refreshDonationInfo();
        return session;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  
  saveSession(session: Session, email: string) {
    loggedInUser.email = email;
    loggedInUser.name = session.name;
    loggedInUser.token = session.token;
    loggedInUser.userid = session.userid;
    localStorage.trailtracker = JSON.stringify(loggedInUser);
  },
  
  async restoreSession() {
    const savedLoggedInUser = localStorage.trailtracker;
    if (savedLoggedInUser) {
      const session = JSON.parse(savedLoggedInUser);
      loggedInUser.email = session.email;
      loggedInUser.name = session.name;
      loggedInUser.token = session.token;
      loggedInUser.userid = session.userid;
    }
    await this.refreshDonationInfo();
  },
  
  clearSession() {
    currentCategories.categories = [];
    // currentCandidates.candidates = [];
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.token = "";
    loggedInUser.userid = "";
    localStorage.removeItem("trailtracker");
  },
  
  async refreshDonationInfo() {
    if (loggedInUser.token) {
      currentCategories.categories = await this.getUserCategories(loggedInUser.token, loggedInUser.userid);
      // currentTrails.trails = await this.getTrailsByCategoryId(loggedInUser.token, id);
    }
  },
  
  async createCategory(category: Category, token: string) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.post(this.baseUrl + "/api/categories", category);
      // console.log("donation-types");
      // console.log(category);
      await this.refreshDonationInfo();
      return response.status == 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  async getTrailById(token: string, id: Trail["_id"]): Promise<Trail> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/trails/" + id);
      console.log("success");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  
  async createTrail(token: string, id: Category["_id"], trail: Trail) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.post(this.baseUrl + "/api/categories/" + id + "/trails", trail);
      // console.log("donation-types");
      // console.log(category);
      await this.refreshDonationInfo();
      return response.status == 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  // passing updateTrail but omitting the _id to comply with Joi validation for hapi backend
  async updateTrailById(token: string, trailId: string, updatedTrail: Omit<Trail, '_id'>, redirect = true) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.put(`${this.baseUrl}/api/categories/${updatedTrail.categoryid}/trails/${trailId}`, updatedTrail);
      await this.refreshDonationInfo();
      // only redirect (goto) if the redirect flag is true
      if (response.status == 200 && redirect) {
        // redirect to the list view after a short delay to allow the user to see the message
        setTimeout(() => {  
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          goto(`/category/${updatedTrail.categoryid}`); 
        }, 500);
      };
      return response.status == 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  cancelUpdateTrail(categoryId: string) {
    // redirects the user back to the category view
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(`/category/${categoryId}`);
  },
  
  async getCandidates(token: string): Promise<Candidate[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/candidates");
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  
  async getTrails(token: string): Promise<Category[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/trails");
      console.log("success");
       // updates global rune
      currentTrails.trails = response.data; 
      console.log(response.data);
    } catch (error) {
      console.log(error)
      return [];
    }
  },

  async getCategories(token: string): Promise<Category[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/categories");
      console.log("success");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error)
      return [];
    }
  },
  
  async getCategoryById(token: string, id: Category["_id"]): Promise<Category> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/categories/" + id);
      console.log("success");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  
  async getUserCategories(token: string, id: User['_id'] ): Promise<Category[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/usercategories/" + id);
      console.log("success");
      console.log(response.data);
       // updates global rune
      currentCategories.categories = response.data;
      return response.data;
    } catch (error) {
      console.log(error)
      return [];
    }
  },

  async getUserTrails(token: string, id: User['_id'] ): Promise<Trail[]> {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.get(this.baseUrl + "/api/usertrails/" + id);
      console.log("success");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error)
      return [];
    }
  },
  
  async deleteCategoryById(token: string, id: Category["_id"]) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.delete(this.baseUrl + "/api/categories/" + id);
      if (response) {
        console.log("Deleted category:", id);
      }
      await this.refreshDonationInfo();
      // remove category from the global rune immediately
      currentCategories.categories = currentCategories.categories.filter(c => c._id !== id);
      return response.status == 204;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  async deleteTrailById(token: string, id: Trail["_id"]) {
    try {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      const response = await axios.delete(this.baseUrl + "/api/trails/" + id);
      if (response) {
        console.log("Deleted trail:", id);
      } 
      await this.refreshDonationInfo();
      // remove trail from the global rune immediately
      currentTrails.trails = currentTrails.trails.filter(t => t._id !== id);
      return response.status == 204;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  
  async uploadImage(categoryId: string, trailId: string, file: File) {
    // creates container to send image file to hapi backend
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData
    const ImageData = new FormData();
    // place image into conatiner with key imagefile
    ImageData.append("imagefile", file);
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/categories/${categoryId}/trails/${trailId}/uploadimage`, ImageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await this.refreshDonationInfo();
      if (response.status == 200) {
        return response.data;
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  //   async getTrailsByCategoryId(token: string, id: Category['_id'] ): Promise<Trail[]> {
  //     try {
  //       let trails: Trail[] = [];
  //       let category: Category | null;
  //       axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  //       category = await axios.get(this.baseUrl + "/api/categories/" + id);
  //       // console.log("success");
  //       // console.log(response.data);
  //       if (category) {
  //         trails = category.trails || [];
  //       } 
  //       console.log(trails);
  //       return trails;
  //     } catch (error) {
  //     console.log(error)
  //       return [];
  //     }
  //   } 
};
