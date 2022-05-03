<?php

use App\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;

Route::post('login', [LoginController::class, 'login'])->name('login');
Route::get('csrf-token', [LoginController::class, 'csrfToken'])->name('csrf-token');