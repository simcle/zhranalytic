<template>
	<div class="h-screen">
		<div class="w-full flex z-10">
			<div class="bg-black h-14 border-b border-gray-800 flex items-center" style="width: 16.25rem">
				<div class="font-semibold text-lg text-gray-500 ml-5">ZHR ANALITYCS</div>
			</div>
			<div class="w-full bg-gray-800 h-14 flex-1">

			</div>
		</div>
		<div class="flex flex-grow relative overflow-hidden h-full">
			<!-- SIDE BAR -->
			<div class=" static bg-neutral-900 flex flex-col flex-shrink-0 h-full" style="width: 16.25rem">
				<div class="h-full bg-neutral-900 text-gray-200">
					<div class="text-lg p-5">Navigation</div>
					<ul class="nav-sidebar">
						<li class="px-5 text-xs mb-3 text-gray-500">MAIN</li>
						<li class="nav-item">
							<router-link to="/" class="nav-link" exact>
								<i class="icon-grid5 mr-5 text-orange-500"></i>
								<span>Dashboard</span>
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/products" class="nav-link" exact>
								<i class="icon-stack2 mr-5 text-green-500"></i>
								<span>Products</span>
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/analytic" class="nav-link" exact>
								<i class="icon-folder-search mr-5 text-yellow-500"></i>
								<span>Analytic</span>
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/outlet" class="nav-link" exact>
								<i class="icon-store mr-5 text-blue-500"></i>
								<span>Outlet</span>
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/task-so" class="nav-link" exact>
								<i class="icon-task mr-5 text-purple-500"></i>
								<span>Tasks SO</span>
							</router-link>
						</li>
						<li class="nav-item">
							<router-link to="/consumptive" class="nav-link" exact>
								<i class="icon-stats-decline mr-5 text-red-500"></i>
								<span>Consumptive</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
			<!-- CONTENT WRAPPER -->
			<div class=" flex flex-col flex-1 relative min-w-0">
				<div class="flex flex-col h-full relative overflow-y-auto mb-20">
					<transition name="fade" mode="out-in">
						<router-view />
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>
