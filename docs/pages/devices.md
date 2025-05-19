# Unofficially supported devices

>[!info]
> Here is the list of devices unofficially supported by KernelSU Next

>[!warning]
> In this page, there are kernels for devices unofficially supporting KernelSU Next, maintained by other developers. So, be cautious about what you are flashing!

<script setup>
import data from '../repos.json'
</script>

<table>
   <thead>
      <tr>
         <th>Maintainer</th>
         <th>Repository</th>
         <th>Support devices</th>
      </tr>
   </thead>
   <tbody>
    <tr v-for="repo in data" :key="repo.devices">
        <td><a :href="repo.maintainer_link" target="_blank" rel="noreferrer">{{ repo.maintainer }}</a></td>
        <td><a :href="repo.kernel_link" target="_blank" rel="noreferrer">{{ repo.kernel_name }}</a></td>
        <td>{{ repo.devices }}</td>
    </tr>
   </tbody>
</table>
